'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { isValidPhoneNumber } from "react-phone-number-input";
import { Controller } from "react-hook-form";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { cn } from '@/lib/utils'
import countryList from 'react-select-country-list'
import flags from "react-phone-number-input/flags";
import PreferredCountrySelect from './PreferredCountrySelect'
import ImagePicker from './ImagePicker'
import { Image01Icon, Image02Icon } from 'hugeicons-react'
import { parseStringCondition } from '@/utils/functions'
import toast from 'react-hot-toast'
import axios from 'axios'

// Dynamic Form Component
const FormBuilder = ({
    formConfig,
    onSubmit,
    className,
    actionButton,
    data,
    showActionButton
}) => {
    const CountriesList = useMemo(() => countryList().getData(), []);

    // Dynamic Zod Schema Generation
    const formSchema = useMemo(() => {
        const schemaFields = formConfig.fields.reduce((acc, field) => {
            // If field has rendering condition, make it optional
            const isConditional = !!field.renderingCondition;

            switch (field.type) {
                case 'url':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().url({
                            message: `${field.label} is not a valid URL`
                        })
                        : z.string().optional()
                    break
                case 'text': case 'country': case 'preferred_country':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().min(field.minLength || 1, {
                            message: `${field.label} is required`
                        })
                        : z.string().optional()
                    break
                case 'email':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().email({ message: "Invalid email address" })
                        : z.string().max(0).or(z.string().email())
                    break
                case 'number':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().min(1, { message: `${field.label} is required` }).refine((val) => {
                            const num = Number(val);
                            return !isNaN(num);
                        }, { message: "Invalid number" }).transform((val) => Number(val))
                        : z.string().optional().refine((val) => {
                            if (val === '' || val === undefined || val === null) return true;
                            const num = Number(val);
                            return !isNaN(num);
                        }, { message: "Invalid number" }).transform((val) => {
                            if (val === '' || val === undefined || val === null) return undefined;
                            return Number(val);
                        })
                    break
                case 'select':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().min(1, {
                            message: `${field.label} is required`
                        })
                        : z.string().optional()
                    break
                case 'radio':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().min(1, {
                            message: `${field.label} is required`
                        })
                        : z.string().optional()
                    break
                case 'textarea':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().min(field.minLength || 1, {
                            message: `${field.label} is required`
                        })
                        : z.string().optional()
                    break
                case 'date':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.date({
                            required_error: `${field.label} is required`
                        })
                        : z.date().optional()
                    break
                case 'phone':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" })
                        : z.string().optional().refine(val => !val || isValidPhoneNumber(val), { message: "Invalid phone number" })
                    break
                case 'multi-checkbox':
                    acc[field.name] = (field.required && !isConditional)
                        ? z.array(z.string()).min(field.minChecked || 1, {
                            message: `Please select at least ${field.minChecked || 1} option(s)`
                        }).max(field.maxChecked || Infinity, {
                            message: `Please select no more than ${field.maxChecked} option(s)`
                        })
                        : z.array(z.string()).optional()
                    break
                case 'image':
                    // file is accepted only
                    acc[field.name] = (field.required && !isConditional)
                        ? z.any().refine((file) => file, {
                            message: `${field.label} is required`
                        })
                        : z.any().optional()
                    break
                case 'relation':
                    if (field.multiple) {
                        acc[field.name] = (field.required && !isConditional)
                            ? z.array(z.string()).min(1, {
                                message: `${field.label} is required`
                            })
                            : z.array(z.string()).optional()
                    } else {
                        acc[field.name] = (field.required && !isConditional)
                            ? z.string().min(1, {
                                message: `${field.label} is required`
                            })
                            : z.string().optional()
                    }
                    break
                default:
                    acc[field.name] = z.string().optional()
            }
            return acc
        }, {})

        return z.object(schemaFields)
    }, [formConfig])

    // Form Hook with Zod Resolver
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: data || formConfig.fields.reduce((acc, field) => {
            acc[field.name] = field.value ||
                (field.type === 'checkbox' ? false :
                    (field.type === 'multi-checkbox' || (field.type === 'relation' && field.multiple) ? [] :
                        (field.type === 'date' ? null : '')))
            return acc
        }, {})
    })

    // Watch all form values to trigger re-renders for conditional rendering
    const watchedValues = form.watch()

    // Render Input Fields
    const renderField = (field, index) => {
        const fieldKey = `${field.name || `field_${index}`}_${index}`;
        const fieldType = field.type || 'text';
        const fieldName = field.name || `field_${index}`;
        const error = form.formState.errors[fieldName];



        const renderInput = () => {
            switch (fieldType) {
                case 'url':
                case 'text':
                case 'email':
                case 'number':
                    return (
                        <div className="space-y-1">
                            <Input
                                type={fieldType}
                                disabled={formConfig.disabled || field.disabled}
                                placeholder={field.placeholder}
                                error={error}
                                {...form.register(fieldName, {
                                    required: field.required,
                                    minLength: field.minLength,
                                    pattern: fieldType === 'email' ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i : undefined
                                })}
                            />
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'textarea':
                    return (
                        <div className="space-y-1">
                            <Textarea
                                disabled={formConfig.disabled || field.disabled}
                                placeholder={field.placeholder}
                                error={error}
                                {...form.register(fieldName, {
                                    required: field.required,
                                    minLength: field.minLength,
                                })}
                            />
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'select':
                    return (
                        <div className="space-y-1">
                            <Select
                                disabled={formConfig.disabled || field.disabled}
                                onValueChange={(value) => { form.setValue(fieldName, value); form.clearErrors(fieldName) }}
                                defaultValue={form.getValues(fieldName)}
                                error={error}
                            >
                                <SelectTrigger className="bg-white" error={error}>
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent className="max-h-64">
                                    {field.options?.map((option, i) => (
                                        <SelectItem key={i} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'country':
                    return (
                        <div className="space-y-1">
                            <Select
                                disabled={formConfig.disabled || field.disabled}
                                onValueChange={(value) => { form.setValue(fieldName, value); form.clearErrors(fieldName) }}
                                defaultValue={form.getValues(fieldName)}
                                error={error}
                            >
                                <SelectTrigger className="bg-white" error={error}>
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent className="max-h-64">
                                    {
                                        CountriesList.map((v, i) => {
                                            var Flag = flags[v.value]
                                            return (
                                                <SelectItem key={i} value={v.label}>
                                                    <div className="flex items-center gap-2 cursor-pointer w-full flex-1">
                                                        <Flag width={20} height={20} /> {v.label}
                                                    </div>
                                                </SelectItem>
                                            )
                                        })
                                    }
                                </SelectContent>
                            </Select>
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'preferred_country':
                    return (
                        <div className="space-y-1">
                            <PreferredCountrySelect
                                disabled={formConfig.disabled || field.disabled}
                                field={{
                                    value: form.getValues(fieldName),
                                    onChange: (value) => {
                                        form.setValue(fieldName, value)
                                        form.clearErrors(fieldName)
                                    }
                                }}
                                error={error}
                                loading={false}
                            />
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'radio':
                    return (
                        <div className="space-y-1">
                            <RadioGroup
                                disabled={formConfig.disabled || field.disabled}
                                onValueChange={(value) => form.setValue(fieldName, value)}
                                defaultValue={form.getValues(fieldName)}
                                error={error}
                            >
                                {field.options?.map((option, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option.value} id={`${fieldKey}_${i}`} />
                                        <Label htmlFor={`${fieldKey}_${i}`}>{option.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'date':
                    return (
                        <div className="space-y-1">
                            <Controller
                                name={fieldName}
                                control={form.control}
                                render={({ field }) => (
                                    <DatePicker
                                        disabled={formConfig.disabled || field.disabled}
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={error}
                                    />
                                )}
                            />
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'multi-checkbox':
                    return (
                        <div className="space-y-1">
                            <div className={`flex border bg-white p-3 rounded-md  flex-col space-y-2 ${error ? "text-red-500 border-red-500" : "border-gray-300"}`}>
                                {field.options?.map((option, i) => (
                                    <div key={i} className="flex items-center space-x-2">
                                        <Checkbox
                                            disabled={formConfig.disabled || field.disabled}
                                            id={`${fieldKey}_${i}`}
                                            checked={form.getValues(fieldName)?.includes(option.value)}
                                            onCheckedChange={(checked) => {
                                                const currentValues = form.getValues(fieldName) || [];
                                                if (checked) {
                                                    form.setValue(fieldName, [...currentValues, option.value]);
                                                    form.clearErrors(fieldName);
                                                } else {
                                                    form.setValue(
                                                        fieldName,
                                                        currentValues.filter((v) => v !== option.value)
                                                    );
                                                }
                                            }}
                                        />
                                        <Label className="font-normal" htmlFor={`${fieldKey}_${i}`}>{option.label}</Label>
                                    </div>
                                ))}
                            </div>
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'phone':
                    return (
                        <div className="space-y-1">
                            <Controller
                                name={fieldName}
                                control={form.control}
                                rules={{ required: field.required }}
                                render={({ field: controllerField }) => (
                                    <PhoneInput
                                        placeholder={field.placeholder}
                                        error={error}
                                        value={controllerField.value}
                                        onChange={controllerField.onChange}
                                    />
                                )}
                            />
                            {field.description && (
                                <p className="text-sm text-gray-500">{field.description}</p>
                            )}
                        </div>
                    );
                case 'image':
                    return (
                        <div className="space-y-1">
                            <Controller
                                name={fieldName}
                                control={form.control}
                                rules={{ required: field.required }}
                                render={({ field: controllerField }) => {


                                    var [tempImage,setTempImage] = useState(null)


                                    const handleImageSave = (fileData, setIsSaved) => {
                                        // Validate file size if specified
                                        if (field.maxFileSize && fileData.size > (field.maxFileSize * 1024 * 1024)) {
                                            form.setError(fieldName, {
                                                type: 'manual',
                                                message: `File size must be less than ${field.maxFileSize}MB`
                                            });
                                            return;
                                        }

                                        // Set the file in the form
                                        controllerField.onChange(fileData?.id);
                                        setTempImage(fileData)
                                        form.clearErrors(fieldName);
                                        
                                        // Close the image picker
                                        setIsSaved();
                                    };

                                    const getImage = async () => {
                                        try{
                                            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sys/files/${controllerField.value}`)
                                            setTempImage(response?.data?.data)
                                        }catch(error){
                                            setTempImage(null)
                                        }
                                    }

                                    useEffect(() => {
                                        if (controllerField.value) {
                                            getImage()
                                        }
                                    }, [controllerField.value])


                                    return (
                                        <div className="space-y-2">
                                            <ImagePicker
                                                onSave={handleImageSave}
                                                aspectRatio={field.aspectRatio}
                                                type={field.type || "avatar"}
                                                saveMessage={field.saveMessage || "Save Image"}
                                                path={field.uploadPath || 'uploads/temp-images'}
                                                removeBg={field.removeBg || false}
                                            >
                                                <div
                                                    className={cn(
                                                        "relative bg-white border border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:bg-gray-50",
                                                        formConfig.disabled && 'opacity-50 cursor-not-allowed',
                                                        form.formState.errors[fieldName] && 'border-red-500 bg-red-50',
                                                        !form.formState.errors[fieldName] && 'border-gray-300'
                                                    )}
                                                >
                                                    {tempImage ? (
                                                        <div className="space-y-2">
                                                            <div className="relative w-full bg-gray-100 rounded-md overflow-hidden">
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${tempImage.path}`}
                                                                    alt="Preview"
                                                                    className={cn("w-full", `aspect-[${field.aspectRatio?.split(':')[0]}/${field.aspectRatio?.split(':')[1]}]`)}
                                                                />
                                                            </div>
                                                            <p className="text-sm text-gray-600">Click to change image</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-1">
                                                            <div className="text-gray-400 mx-auto flex justify-center">
                                                                <Image01Icon strokeWidth={1} size={40} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-gray-700">
                                                                    {field.placeholder || 'Click to upload image'}
                                                                </p>
                                                                <p className="text-[10px] text-gray-500">
                                                                    JPEG, PNG, GIF, WEBP up to <span className="font-bold">{field.maxFileSize || 5}MB</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </ImagePicker>
                                            
                                            {field.description && (
                                                <p className="text-sm text-gray-500">{field.description}</p>
                                            )}
                                        </div>
                                    );









                                }}
                            />
                        </div>
                    );
                case 'relation':
                    return (
                        <div className="space-y-1">
                            <Controller
                                name={fieldName}
                                control={form.control}
                                rules={{ required: field.required }}
                                render={({ field: controllerField }) => {
                                    const [options, setOptions] = React.useState([]);
                                    const [loading, setLoading] = React.useState(false);
                                    const [searchTerm, setSearchTerm] = React.useState('');

                                    // Fetch options from API
                                    const fetchOptions = React.useCallback(async () => {
                                        if (!field.apiEndpoint) {
                                            setOptions([]);
                                            return;
                                        }

                                        setLoading(true);
                                        try {
                                            let url = field.apiEndpoint;
                                            if (field.queryParams) {
                                                url += `?${field.queryParams}`;
                                            }
                                            
                                            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`);
                                            const data = response.data;
                                            
                                            // Handle different response formats
                                            const items = Array.isArray(data) ? data : (data.data || data.items || []);
                                            
                                            const formattedOptions = items.map(item => ({
                                                ...item,
                                                label: item[field.labelField || 'name'],
                                                value: item[field.valueField || 'id'],
                                               
                                            }));
                                            
                                            setOptions(formattedOptions);
                                        } catch (error) {
                                            console.error('Error fetching relation options:', error);
                                            setOptions([]);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }, [field.apiEndpoint, field.queryParams, field.labelField, field.valueField]);

                                    // Fetch options on mount and when dependencies change
                                    React.useEffect(() => {
                                        fetchOptions();
                                    }, [fetchOptions]);

                                    // Filter options based on search term
                                    const filteredOptions = options;

                                    if (field.multiple) {
                                        // Multi-select relation field
                                        return (
                                            <div className="space-y-2">
                                                <div className={`border bg-white rounded-md p-3 ${error ? 'border-red-500' : 'border-gray-300'}`}>
                                                    {loading ? (
                                                        <div className="text-center py-4 text-gray-500">Loading options...</div>
                                                    ) : filteredOptions.length === 0 ? (
                                                        <div className="text-center py-4 text-gray-500">
                                                            {field.apiEndpoint ? 'No options available' : 'No API endpoint configured'}
                                                        </div>
                                                    ) : (
                                                        filteredOptions.map((option, index) => (
                                                            <div key={index} className="flex items-center space-x-2 py-1">
                                                                <Checkbox
                                                                    disabled={formConfig.disabled || field.disabled}
                                                                    id={`${fieldKey}_${index}`}
                                                                    checked={controllerField.value?.includes(option.value) || false}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValues = controllerField.value || [];
                                                                        if (checked) {
                                                                            controllerField.onChange([...currentValues, option.value]);
                                                                            form.clearErrors(fieldName);
                                                                        } else {
                                                                            controllerField.onChange(
                                                                                currentValues.filter((v) => v !== option.value)
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                <Label className="font-normal text-sm" htmlFor={`${fieldKey}_${index}`}>
                                                                    {option.label}
                                                                </Label>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                                {field.description && (
                                                    <p className="text-sm text-gray-500">{field.description}</p>
                                                )}
                                            </div>
                                        );
                                    } else {
                                        // Single-select relation field
                                        return (
                                            <div className="space-y-2">
                                                <Select
                                                    disabled={formConfig.disabled || field.disabled || loading}
                                                    onValueChange={(value) => { 
                                                        controllerField.onChange(value); 
                                                        form.clearErrors(fieldName) 
                                                    }}
                                                    value={controllerField.value || ''}
                                                >
                                                    <SelectTrigger className="bg-white" error={error}>
                                                        <SelectValue placeholder={loading ? 'Loading...' : (field.placeholder || 'Select an option')} />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-64">
                                                        {loading ? (
                                                            <div className="p-2 text-center text-gray-500">Loading options...</div>
                                                        ) : filteredOptions.length === 0 ? (
                                                            <div className="p-2 text-center text-gray-500">
                                                                {field.apiEndpoint ? 'No options available' : 'No API endpoint configured'}
                                                            </div>
                                                        ) : (
                                                            filteredOptions.map((option, index) => (
                                                                <SelectItem key={index} value={option.value}>
                                                                    {option.label}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                {field.description && (
                                                    <p className="text-sm text-gray-500">{field.description}</p>
                                                )}
                                            </div>
                                        );
                                    }
                                }}
                            />
                        </div>
                    );
                default:
                    return null;
            }
        };

        return (
            <FormField
                key={fieldKey}
                control={form.control}
                name={fieldName}
                render={({ field: formField }) => (
                    <FormItem className="space-y-1">
                        <FormLabel className={cn("text-xs", formConfig.disabled && "text-gray-500")} error={error}>{field.label} {field.required && <span className="text-red-500">*</span>}</FormLabel>
                        <FormControl>{renderInput()}</FormControl>
                    </FormItem>
                )}
            />
        );
    }

    const submissionHanler = (data) => {

        // now check all field which has rendering condition and rendered and is required now set those field as required using hook form
        var isError = false
        formConfig.fields.forEach((field) => {
            if (field.renderingCondition) {
                const condition = parseStringCondition({ expression: field.renderingCondition, data: watchedValues })
                if (condition && field.required && !form.getValues(field.name)) {
                    form.setError(field.name, { message: `${field.label} is required` })
                    isError = true
                }
            }
        })

        // return if form is invalid
        if (isError) return

        onSubmit(data, form)
    }

    const submissionAttempt = () => {
        formConfig.fields.forEach((field) => {
            if (field.renderingCondition) {
                const condition = parseStringCondition({ expression: field.renderingCondition, data: watchedValues })
                if (condition && field.required && (!form.getValues(field.name))) {
                    toast.error(`${field.label} is required`)
                    return
                }
            }
        })
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => submissionHanler(data))}
                className={`grid grid-cols-6 gap-4 ${className}`}
            >
                {
                    formConfig.fields.map((field, index) => {

                        if (field.renderingCondition) {
                            const condition = parseStringCondition({ expression: field.renderingCondition, data: watchedValues })
                            if (!condition) return null
                        }

                        return (
                            <div
                                key={`${field.name}_${index}`}
                                className={cn(
                                    "col-span-6",
                                    field.cols === 1 ? "md:col-span-1" :
                                        field.cols === 2 ? "md:col-span-2" :
                                            field.cols === 3 ? "md:col-span-3" :
                                                field.cols === 4 ? "md:col-span-4" :
                                                    field.cols === 5 ? "md:col-span-5" :
                                                        "md:col-span-6"
                                )}
                            >
                                {renderField(field, index)}
                                <div className='text-[9px] tracking-tight mt-[2px] text-red-500'>{form.formState.errors[field.name]?.message}</div>
                            </div>
                        )
                    })
                }

                {/* Submit Button */}
                {(!formConfig.disabled) && showActionButton && (
                    <div className="col-span-6">
                        <Button onClick={submissionAttempt} size="sm" type="submit">{actionButton}</Button>
                    </div>
                )}

                <div className='hidden col-span-3'></div>
            </form>
        </Form>
    )
}

// Example Usage Component
export const DynamicForm = ({ formConfig, onSubmit, data, actionButton = "Submit", showActionButton = true }) => {

    return (
        <>
            {
                (formConfig && formConfig?.fields?.length > 0) ? (
                    <FormBuilder
                        formConfig={formConfig}
                        onSubmit={onSubmit}
                        data={data}
                        actionButton={actionButton}
                        showActionButton={showActionButton}
                    />
                ) : (
                    <div>
                        <p>No form config provided</p>
                    </div>
                )
            }
        </>
    )
}

export default DynamicForm 