'use client'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'

import Code from '@tiptap/extension-code'
import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Highlighter, Italic, LinkIcon, Paperclip, Underline as UnderlineIcon, X, ChevronDown } from 'lucide-react'
import { Button } from './ui/button'
import { Image01Icon, LeftToRightListBulletIcon, LeftToRightListNumberIcon } from 'hugeicons-react'
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatBytes } from '@/utils/functions'
import toast from 'react-hot-toast'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import FilesUploadWidget from './FilesUploadWidget'
import { getFileExtensionImage } from '@/data'
import ImagePicker from './ImagePicker'

const RichTextEditor = ({
  placeholder = 'Write something …',
  className = '',
  maxHeight = '250px',
  attachmentsPath = 'students/1/application/1/notes-attachments',
  imagesPath = 'students/1/application/1/rich-text-images',
  onChangeContent,
  value,
  editorClassName = '',
  editorWrapperClassName = '',
  disableFeatures = [],
  onAttachmentRemoved = null // Callback for tracking removed attachments
}) => {



  // Single source of truth for content state
  const [content, setContent] = useState({
    richText: {
      html: value?.richText?.html || '',
      json: value?.richText?.json || {}
    },
    attachments: value?.attachments || []
  })



  const previousImagesRef = useRef([]) // Track previous images in editor


  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Code,
      StarterKit,
      Highlight,
      Underline,
      Image,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        },

      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'cursor-text before:content-[attr(data-placeholder)] before:absolute before:top-0 before:left-0 before:text-mauve-11 before:opacity-50 before-pointer-events-none',
      }),
    ],
    content: value?.richText?.html || '', // Start with empty content, we'll set it via useEffect
    onUpdate: ({ editor }) => {
      // Don't update content during initialization
      setContent(prevContent => ({
        ...prevContent,
        richText: {
          html: editor.getHTML(),
          json: editor.getJSON()
        }
      }));
    }
  })

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()
      return
    }

    // update link
    try {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url })
        .run()
    } catch (e) {
      alert(e.message)
    }
  }, [editor])



  const deleteFileByUrl = async (imageUrl, isPrivate = false) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/s3/delete-file-by-url`, {
        data: {
          url: imageUrl,
          isPrivate: isPrivate
        }
      })
    } catch (error) {
      toast.error('Error deleting image')
    }
  }



  // Helper function to extract image URLs from editor content
  const extractImagesFromContent = (content) => {
    const images = [];

    const traverse = (node) => {
      if (node.type === 'image' && node.attrs?.src) {
        images.push(node.attrs.src);
      }

      if (node.content) {
        node.content.forEach(traverse);
      }
    };

    traverse(content);
    return images;
  };
  // Function to handle image removal from editor content
  const handleImageRemovalFromEditor = () => {
    if (editor) {
      // Listen for changes in the editor content
      editor.on('update', ({ editor }) => {
        const content = editor.getJSON();
        const currentImages = extractImagesFromContent(content);

        // Compare with previous images to detect removals
        const previousImages = previousImagesRef.current;
        const removedImages = previousImages.filter(img => !currentImages.includes(img));

        // Track removed images
        removedImages.forEach(imageUrl => {
          deleteFileByUrl(imageUrl, false)
        });

        // Update previous images
        previousImagesRef.current = currentImages;
      });
    }
  };


  // Set up image removal tracking when editor is ready
  useEffect(() => {
    if (editor) {
      // Initialize previous images tracking
      const content = editor.getJSON();
      previousImagesRef.current = extractImagesFromContent(content);

      // Set up image removal tracking
      handleImageRemovalFromEditor();
    }
  }, [editor]);


  useEffect(() => {
    onChangeContent(content)
  }, [content])

  const removeAttachmentHandler = async (attachment) => {
    await deleteFileByUrl(attachment.path, true)
    setContent(prevContent => ({
      ...prevContent,
      attachments: prevContent.attachments.filter(a => a.id !== attachment.id)
    }))
  }

  // Get current text type (paragraph or heading level)
  const getCurrentTextType = () => {
    if (!editor) return 'Paragraph'
    
    if (editor.isActive('heading', { level: 1 })) return 'Heading 1'
    if (editor.isActive('heading', { level: 2 })) return 'Heading 2'
    if (editor.isActive('heading', { level: 3 })) return 'Heading 3'
    if (editor.isActive('heading', { level: 4 })) return 'Heading 4'
    if (editor.isActive('heading', { level: 5 })) return 'Heading 5'
    if (editor.isActive('heading', { level: 6 })) return 'Heading 6'
    return 'Paragraph'
  }

  const setTextType = (type) => {
    if (!editor) return
    
    if (type === 'paragraph') {
      editor.chain().focus().setParagraph().run()
    } else {
      editor.chain().focus().setHeading({ level: type }).run()
    }
  }


  return (
    <div className={cn('rounded-md bg-white border overflow-hidden', className)}>

      {
        editor && <div className={`flex gap-1 border-b p-2`} >
          {/* Text Type Selector */}
          {!disableFeatures.includes('tag_selector') && <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                variant='outline'
                size="sm"
                className="h-6 px-2 text-xs font-medium gap-1"
              >
                {getCurrentTextType()}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem
                onClick={() => setTextType('paragraph')}
                className={cn(
                  "cursor-pointer text-sm",
                  editor.isActive('paragraph') && "bg-accent"
                )}
              >
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTextType(1)}
                className={cn(
                  "cursor-pointer text-xl font-bold",
                  editor.isActive('heading', { level: 1 }) && "bg-accent"
                )}
              >
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTextType(2)}
                className={cn(
                  "cursor-pointer text-lg font-bold",
                  editor.isActive('heading', { level: 2 }) && "bg-accent"
                )}
              >
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTextType(3)}
                className={cn(
                  "cursor-pointer text-base font-bold",
                  editor.isActive('heading', { level: 3 }) && "bg-accent"
                )}
              >
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTextType(4)}
                className={cn(
                  "cursor-pointer text-sm font-semibold",
                  editor.isActive('heading', { level: 4 }) && "bg-accent"
                )}
              >
                Heading 4
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTextType(5)}
                className={cn(
                  "cursor-pointer text-sm font-semibold",
                  editor.isActive('heading', { level: 5 }) && "bg-accent"
                )}
              >
                Heading 5
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTextType(6)}
                className={cn(
                  "cursor-pointer text-xs font-semibold",
                  editor.isActive('heading', { level: 6 }) && "bg-accent"
                )}
              >
                Heading 6
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}


          {
            [
              {
                name: 'bold',
                title: 'Bold',
                icon: <Bold className="h-3 w-3" />,
                onClick: () => editor.chain().focus().toggleBold().run()
              },
              {
                name: 'italic',
                title: 'Italic',
                icon: <Italic className="h-3 w-3" />,
                onClick: () => editor.chain().focus().toggleItalic().run()
              },
              {
                name: 'underline',
                title: 'Underline',
                icon: <UnderlineIcon className="h-3 w-3" />,
                onClick: () => editor.chain().focus().toggleUnderline().run()
              },
              {
                name: 'highlight',
                title: 'Highlight',
                icon: <Highlighter className="h-3 w-3" />,
                onClick: () => editor.chain().focus().toggleHighlight().run()
              },
              {
                name: 'bulletList',
                title: 'Bullet List',
                icon: <LeftToRightListBulletIcon strokeWidth={2} className="h-3 w-3" />,
                onClick: () => editor.chain().focus().toggleBulletList().run()
              },
              {
                name: 'orderedList',
                title: 'Numbered List',
                icon: <LeftToRightListNumberIcon strokeWidth={2} className="h-3 w-3" />,
                onClick: () => editor.chain().focus().toggleOrderedList().run()
              },
              {
                name: 'link',
                title: 'Link',
                icon: <LinkIcon className="h-3 w-3" />,
                onClick: setLink
              },
            ].map((item, index) => (
              <TooltipProvider key={index}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      key={index}
                      type='button'
                      onClick={item.onClick}
                      variant={editor.isActive(item.name) ? 'default' : 'outline'}
                      size="icon"
                      className="w-6 h-6"
                    >
                      {item.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))
          }

          {!disableFeatures.includes('images') && <ImagePicker
            overlayStyle="bg-transparent bg-black/40"
            onSave={async (file, setIsSaved) => {
              // console.log(file)
              editor.chain().focus().setImage({
                src: `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${file?.path}`, // Use the uploaded URL instead of blob URL
                id: "images"
              }).run()
              setIsSaved()
            }}
            path={`uploads/invoice-proofs`}
          >
            <Button
              type='button'
              variant={'outline'}
              className='cursor-pointer flex items-center gap-1 h-6 px-1'
            >
              <Image01Icon className="h-3 w-3" />
              <div className='text-xs tracking-tight text-gray-700'>Image</div>
            </Button>
          </ImagePicker>}

          {!disableFeatures.includes('attachments') && <FilesUploadWidget
            onUploadSuccess={(file) => {
              if (content?.attachments?.find(a => a.id === file.id)) {
                return
              }
              setContent(prevContent => ({
                ...prevContent,
                attachments: [...prevContent.attachments, file]
              }))
            }}
          >
            <Button
              type='button'
              variant={'outline'}
              className='cursor-pointer flex items-center gap-1 h-6 px-1'
            >
              <Paperclip className="h-3 w-3" />
              <div className='text-xs tracking-tight text-gray-700'>Attachments</div>
            </Button>
          </FilesUploadWidget>}

        </div>
      }

      <div className={cn(`overflow-y-auto relative text-sm bg-gray-50`, editorWrapperClassName)}>

        <EditorContent className={cn(`notesRichText p-3 min-h-20`, editorClassName)} editor={editor} />

        {content?.attachments?.length > 0 &&
          <div className='p-4 border-t border-dashed'>
            <div className='text-sm font-medium mb-2'>Attachments</div>
            <div className='grid grid-cols-2 gap-3'>
              {
                content?.attachments?.map((attachment, index) => (
                  <div key={index} className='flex items-center gap-2 p-1 relative z-10 rounded-full bg-white border'>

                    <div className="flex items-center gap-1 flex-1">
                      <div className='relative z-10 pl-1'>
                        <div className='w-8 h-8 cursor-pointer p-1'>
                          <img src={getFileExtensionImage(attachment.extension)} alt="" className="w-full h-full my-0" />
                        </div>
                      </div>

                      <div className='relative z-10 tracking-tight'>
                        <div className='line-clamp-1 tracking-tight font-medium text-xs translate-y-[4px]'>{attachment.name}</div>
                        <div className='flex items-center gap-1 text-[10px] translate-y-[1px]'>
                          <p>{formatBytes(attachment.size)}</p>
                          <div className='font-bold'>•</div>
                          <p className="uppercase">{attachment.extension}</p>
                        </div>
                      </div>
                    </div>


                    <div className='absolute -top-2 -right-2'>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger asChild>
                            <button type='button' onClick={() => removeAttachmentHandler(attachment)} className="w-6 h-6 text-red-600 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors">
                              <X className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="text-[10px] border-[0.5px] rounded-sm border-white/20 px-[6px] py-[2px]">
                            Remove Attachment
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                  </div>
                ))
              }
            </div>
          </div>
        }

      </div>

    </div>
  )
}

export default RichTextEditor
