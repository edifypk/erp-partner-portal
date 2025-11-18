'use client'

import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, GripHorizontal, Settings, MoreVertical } from "lucide-react"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const FIELD_TYPES = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email Input' },
    { value: 'number', label: 'Number Input' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'date', label: 'Date Picker' },
    { value: 'url', label: 'URL Input' },
    { value: 'multi-checkbox', label: 'Multi Checkbox' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'country', label: 'Country' },
    { value: 'preferred_country', label: 'Preferred Country' },
    { value: 'image', label: 'Image Upload' },
    { value: 'relation', label: 'Relation Field' },
]

const FIELD_TYPE_MENU = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'url', label: 'URL' },
    { value: 'select', label: 'Single Select' },
    { value: 'multi-checkbox', label: 'Multi Select' },
    { value: 'date', label: 'Date' },
    { value: 'country', label: 'Country' },
    { value: 'preferred_country', label: 'Preferred Country' },
    { value: 'image', label: 'Image Upload' },
    { value: 'relation', label: 'Relation Field' },
]

const FIELD_WIDTHS = [
    { value: 2, label: '33%', cols: 2 },
    { value: 3, label: '50%', cols: 3 },
    { value: 4, label: '66%', cols: 4 },
    { value: 6, label: '100%', cols: 6 }
];

const SortableItem = ({ field, index, onSelect, onRemove, isSelected, onFieldChange }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: field.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 1 : 1,
    }

    const handleFieldChange = (updates) => {
        onFieldChange(index, updates);
    };

    const handleInputClick = (e) => {
        e.stopPropagation();
    };

    const [newOption, setNewOption] = React.useState("");
    const [editingOptionIdx, setEditingOptionIdx] = React.useState(null);
    const [editingOptionValue, setEditingOptionValue] = React.useState("");

    const handleAddOption = () => {
        if (!newOption.trim()) return;
        const updatedOptions = [
            ...(field.options || []),
            { label: newOption, value: newOption }
        ];
        handleFieldChange({ options: updatedOptions });
        setNewOption("");
    };

    const handleRemoveOption = (idx) => {
        const updatedOptions = (field.options || []).filter((_, i) => i !== idx);
        handleFieldChange({ options: updatedOptions });
    };

    const handleEditOptionLabel = (idx, label) => {
        const updatedOptions = (field.options || []).map((opt, i) =>
            i === idx ? { ...opt, label } : opt
        );
        handleFieldChange({ options: updatedOptions });
    };

    const handleEditOptionValue = (idx, value) => {
        const updatedOptions = (field.options || []).map((opt, i) =>
            i === idx ? { ...opt, value } : opt
        );
        handleFieldChange({ options: updatedOptions });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative bg-white border group rounded-2xl p-0 shadow-sm mb-2 ${isDragging ? "z-20" : ""} ${isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}`}
            onClick={e => onSelect(field, e)}
        >
            <div
                className={`flex opacity-0 mx-auto max-w-10 group-hover:opacity-100 transition-opacity duration-200 justify-center items-center pt-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                {...attributes}
                {...listeners}
            >
                <GripHorizontal className="h-5 w-5 text-gray-400" />
            </div>

            <div className="px-6 pt-2 pb-4">
                <div className="flex items-center mb-1">
                    <div className="w-8">
                        <img src={`/images/form/${field.type}.svg`} alt="Text Cursor Input" className="w-5 h-5" />
                    </div>

                    {isSelected ? (
                        <input
                            className="font-bold w-full text-lg bg-transparent border border-blue-200 focus:outline-none focus:border-blue-400"
                            value={field.label}
                            onChange={e => handleFieldChange({ label: e.target.value })}
                            onClick={handleInputClick}
                        />
                    ) : (
                        <span className="font-bold text-lg mr-2">{field.label}</span>
                    )}
                </div>
                <div className="mb-4 pl-8">
                    {isSelected ? (
                        <>
                            <input
                                className="w-full bg-transparent border border-blue-100 focus:outline-none focus:border-blue-400 text-gray-500"
                                placeholder="Add a description"
                                value={field.description || ''}
                                onChange={e => handleFieldChange({ description: e.target.value })}
                                onClick={handleInputClick}
                            />
                        </>
                    ) : (
                        <span className="text-gray-500">{field.description || 'Add a description'}</span>
                    )}
                    {(field.type === 'select' || field.type === 'multi-checkbox' || field.type === 'radio' || field.type === 'relation') && (
                        <div className="space-y-1 mt-3">
                            <Label className="text-xs">
                                {field.type === 'relation' ? 'API Options' : 'Options'}
                            </Label>
                            {field.type === 'relation' ? (
                                <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                                    Options will be fetched from: <strong>{field.apiEndpoint || 'No API endpoint configured'}</strong>
                                    {field.apiEndpoint && (
                                        <div className="mt-1">
                                            <span>Label field: <strong>{field.labelField}</strong></span>
                                            <span className="ml-2">Value field: <strong>{field.valueField}</strong></span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {(field.options || []).map((option, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <Input
                                                value={option.label}
                                                readOnly={!isSelected}
                                                className="h-8 flex-1"
                                                onChange={isSelected ? (e) => handleEditOptionLabel(idx, e.target.value) : undefined}
                                            />
                                            {isSelected && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <div className="p-2 space-y-2">
                                                            <Input
                                                                value={editingOptionIdx === idx ? editingOptionValue : option.value}
                                                                onChange={e => {
                                                                    setEditingOptionIdx(idx);
                                                                    setEditingOptionValue(e.target.value);
                                                                }}
                                                                onBlur={() => {
                                                                    if (editingOptionIdx === idx) {
                                                                        handleEditOptionValue(idx, editingOptionValue);
                                                                        setEditingOptionIdx(null);
                                                                        setEditingOptionValue("");
                                                                    }
                                                                }}
                                                                onKeyDown={e => {
                                                                    if (e.key === 'Enter') {
                                                                        handleEditOptionValue(idx, editingOptionValue);
                                                                        setEditingOptionIdx(null);
                                                                        setEditingOptionValue("");
                                                                    }
                                                                }}
                                                                className="h-8"
                                                                autoFocus={editingOptionIdx === idx}
                                                            />
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => handleRemoveOption(idx)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {isSelected && field.type !== 'relation' && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Input
                                        value={newOption}
                                        onChange={e => setNewOption(e.target.value)}
                                        placeholder="Add an option"
                                        className="h-8 flex-1"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') handleAddOption();
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-blue-600"
                                        onClick={handleAddOption}
                                        tabIndex={-1}
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between border-t px-6 py-2">
                <div className="flex items-center gap-2">

                    <div>
                        <div className="flex items-center gap-2 justify-between py-2">
                            <Label className="text-xs">Required</Label>
                            <Switch
                                checked={field.required || false}
                                className="data-[state=checked]:bg-gray-400"
                                onCheckedChange={(checked) => {
                                    handleFieldChange({ required: checked });
                                }}
                            />
                        </div>
                    </div>

                </div>

                <div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <div className="p-2 grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Field Name</Label>
                                    <Input
                                        value={field.name || ''}
                                        onChange={e => handleFieldChange({ name: e.target.value })}
                                        onClick={handleInputClick}
                                        className="h-8"
                                    />
                                </div>
                               
                                <div className="space-y-1">
                                    <Label className="text-xs">Placeholder</Label>
                                    <Input
                                        value={field.placeholder || ''}
                                        onChange={e => handleFieldChange({ placeholder: e.target.value })}
                                        onClick={handleInputClick}
                                        className="h-8"
                                    />
                                </div>
                                {field.type !== 'image' && <div className="space-y-1">
                                    <Label className="text-xs">Field Width</Label>
                                    <Select
                                        value={field.cols?.toString() || "6"}
                                        onValueChange={(value) => {
                                            handleFieldChange({ cols: parseInt(value) });
                                        }}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Select width" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FIELD_WIDTHS.map((width) => (
                                                <SelectItem key={width.value} value={width.value.toString()}>
                                                    {width.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>}
                                {field.type !== 'image' && <div className="space-y-1">
                                    <Label className="text-xs">Rendering Condition</Label>
                                    <Input
                                        type="text"
                                        placeholder="Enter condition"
                                        value={field.renderingCondition || ''}
                                        onChange={e => handleFieldChange({ renderingCondition: e.target.value })}
                                        onClick={handleInputClick}
                                        className="h-8"
                                    />
                                </div>}
                                {field.type === 'image' && (
                                    <>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Max File Size (MB)</Label>
                                            <Input
                                                type="number"
                                                value={field.maxFileSize || 5}
                                                onChange={e => handleFieldChange({ maxFileSize: e.target.value})}
                                                onClick={handleInputClick}
                                                className="h-8"
                                                min="1"
                                                max="50"
                                            />
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <Label className="text-xs">Aspect Ratio</Label>
                                            <Select
                                                value={field.aspectRatio || "free"}
                                                onValueChange={(value) => {
                                                    handleFieldChange({ aspectRatio: value === "free" ? null : value });
                                                }}
                                            >
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select aspect ratio" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="free">Free (No restriction)</SelectItem>
                                                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                                                    <SelectItem value="4:3">Landscape (4:3)</SelectItem>
                                                    <SelectItem value="3:4">Portrait (3:4)</SelectItem>
                                                    <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                                                    <SelectItem value="4:1">Banner (4:1)</SelectItem>
                                                    <SelectItem value="9:16">Mobile (9:16)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>


                                        <div className="space-y-1 col-span-2">
                                            <Label className="text-xs">Upload Path</Label>
                                            <Input
                                                value={field.uploadPath || "form_uploads"}
                                                onChange={e => handleFieldChange({ uploadPath: e.target.value })}
                                                onClick={handleInputClick}
                                                className="h-8"
                                            />
                                        </div>

                                    </>
                                )}

                                {field.type === 'relation' && (
                                    <>
                                        <div className="space-y-1 col-span-2">
                                            <Label className="text-xs">API Endpoint</Label>
                                            <Input
                                                value={field.apiEndpoint || ''}
                                                onChange={e => handleFieldChange({ apiEndpoint: e.target.value })}
                                                onClick={handleInputClick}
                                                className="h-8"
                                                placeholder="e.g., /api/users"
                                            />
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <Label className="text-xs">Label Field</Label>
                                            <Input
                                                value={field.labelField || 'name'}
                                                onChange={e => handleFieldChange({ labelField: e.target.value })}
                                                onClick={handleInputClick}
                                                className="h-8"
                                                placeholder="e.g., name, title"
                                            />
                                        </div>
                                        
                                        <div className="space-y-1">
                                            <Label className="text-xs">Value Field</Label>
                                            <Input
                                                value={field.valueField || 'id'}
                                                onChange={e => handleFieldChange({ valueField: e.target.value })}
                                                onClick={handleInputClick}
                                                className="h-8"
                                                placeholder="e.g., id, _id"
                                            />
                                        </div>
                                        
                                        <div className="flex items-center gap-2 space-y-0">
                                            <Label className="text-xs">Multiple Selection</Label>
                                            <Switch
                                                checked={field.multiple || false}
                                                className="data-[state=checked]:bg-gray-400"
                                                onCheckedChange={(checked) => {
                                                    handleFieldChange({ multiple: checked });
                                                }}
                                            />
                                        </div>
                                    
                                    </>
                                )}

                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={e => { e.stopPropagation(); onRemove(index); }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                </div>


            </div>
        </div>
    )
}

const DynamicFormBuilder = ({ initialConfig, onChange }) => {
    const [formConfig, setFormConfig] = useState(initialConfig || { fields: [] })
    const [selectedField, setSelectedField] = useState(null)
    const [addMenuOpen, setAddMenuOpen] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const addFieldOfType = (type) => {
        const typeDef = FIELD_TYPE_MENU.find(f => f.value === type) || FIELD_TYPES.find(f => f.value === type)
        const newField = {
            id: Math.random().toString(36).substring(2, 15),
            name: `${type}_${formConfig.fields.length + 1}`,
            label: typeDef?.label || `Field ${formConfig.fields.length + 1}`,
            type,
            required: false,
            placeholder: type === 'image' ? 'Click to upload image' : `Enter ${typeDef?.label?.toLowerCase() || 'value'}`,
            cols: 6 // Default to full width
        }

        // Add image-specific defaults
        if (type === 'image') {
            newField.maxFileSize = 5
            newField.acceptedTypes = 'image/jpeg,image/png,image/gif,image/webp,image/bmp,image/tiff'
            newField.multiple = false
            newField.enableCropping = true // Enable cropping by default
            newField.aspectRatio = null // Default to free aspect ratio
        }

        // Add relation-specific defaults
        if (type === 'relation') {
            newField.apiEndpoint = ''
            newField.labelField = 'name'
            newField.valueField = 'id'
            newField.multiple = false
            newField.searchable = false
            newField.queryParams = ''
        }

        setFormConfig(prev => ({
            ...prev,
            fields: [...prev.fields, newField]
        }))
        setSelectedField(newField)
    }

    const updateField = (index, data) => {
        const newFields = [...formConfig.fields]
        newFields[index] = { ...newFields[index], ...data }
        setFormConfig(prev => ({
            ...prev,
            fields: newFields
        }))
    }

    const removeField = (index) => {
        const newFields = formConfig.fields.filter((_, i) => i !== index)
        setFormConfig(prev => ({
            ...prev,
            fields: newFields
        }))
        if (selectedField === formConfig.fields[index]) {
            setSelectedField(null)
        }
    }

    const handleDragEnd = (event) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setFormConfig((prev) => {
                const oldIndex = prev.fields.findIndex((field) => field.id === active.id)
                const newIndex = prev.fields.findIndex((field) => field.id === over.id)

                return {
                    ...prev,
                    fields: arrayMove(prev.fields, oldIndex, newIndex),
                }
            })
        }
    }

    useEffect(() => {
        onChange(formConfig?.fields)
    }, [formConfig])


    return (
        <div onClick={() => setSelectedField(null)} className="">

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={formConfig.fields.map(field => field.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-4">
                        {formConfig.fields.map((field, index) => (
                            <SortableItem
                                key={field.id}
                                field={field}
                                index={index}
                                isSelected={selectedField?.id === field.id}
                                onSelect={(field, e) => {
                                    e.stopPropagation();
                                    setSelectedField(field);
                                }}
                                onRemove={removeField}
                                onFieldChange={updateField}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Add Field Dropdown */}
            <div className="flex justify-center pt-4">
                <DropdownMenu open={addMenuOpen} onOpenChange={setAddMenuOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-200 shadow"
                            aria-label="Add new field"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="grid grid-cols-2">
                        {FIELD_TYPE_MENU.map(type => (
                            <DropdownMenuItem
                                key={type.value}
                                onClick={() => {
                                    addFieldOfType(type.value);
                                    setAddMenuOpen(false);
                                }}
                                className="cursor-pointer"
                            >
                                <img src={`/images/form/${type.value}.svg`} alt={type.label} className="w-4 h-4 mr-1" />
                                {type.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default DynamicFormBuilder