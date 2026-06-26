'use client'

import { useEffect, useRef, useState } from 'react'
import MediaPicker from './MediaPicker'

const TOOLBAR_GROUPS = [
  [
    { title: 'Heading 2', action: (exec) => exec('formatBlock', 'h2'), label: 'H2', className: 'font-bold text-xs' },
    { title: 'Heading 3', action: (exec) => exec('formatBlock', 'h3'), label: 'H3', className: 'font-semibold text-xs' },
    { title: 'Paragraph', action: (exec) => exec('formatBlock', 'p'), label: 'P', className: 'text-xs' },
  ],
  [
    {
      title: 'Bold', action: (exec) => exec('bold'), icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h8a4 4 0 0 1 0 8H6V4zm0 8h9a4 4 0 0 1 0 8H6v-8z" /></svg>
      )
    },
    {
      title: 'Italic', action: (exec) => exec('italic'), icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.49 3h6v2h-2.36l-3.28 14H14v2H8v-2h2.36l3.28-14H11.49V3z" /></svg>
      )
    },
    {
      title: 'Underline', action: (exec) => exec('underline'), icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3v8a6 6 0 0 0 12 0V3h-2v8a4 4 0 0 1-8 0V3H6zm-1 16h14v2H5v-2z" /></svg>
      )
    },
  ],
  [
    {
      title: 'Bullet List', action: (exec) => exec('insertUnorderedList'), icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2zM2 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" /></svg>
      )
    },
    {
      title: 'Numbered List', action: (exec) => exec('insertOrderedList'), icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h2v4H4V5H3V4zm1 9H3v1h2v-1zm-2 5h3v1H2v-1zm19-2H7v2h14v-2zM7 6h14V4H7v2zm0 7h14v-2H7v2z" /></svg>
      )
    },
    {
      title: 'Blockquote', action: (exec) => exec('formatBlock', 'blockquote'), icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" /></svg>
      )
    },
  ],
  [
    {
      title: 'Insert Link', id: 'link', icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.657 14.828l-1.414-1.414L17.657 12A4 4 0 0 0 12 6.343l-1.414 1.414-1.414-1.414 1.414-1.414a6 6 0 0 1 8.485 8.485l-1.414 1.414zm-2.829 2.829l-1.414 1.414a6 6 0 1 1-8.485-8.485l1.414-1.414 1.414 1.414L6.343 12A4 4 0 0 0 12 17.657l1.414-1.414 1.414 1.414zm-.707-10.606l1.414 1.414-7.071 7.071-1.414-1.414 7.071-7.071z" /></svg>
      )
    },
    {
      title: 'Insert Image', id: 'image', icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.992 21A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6-3.864 3.864L8 14l-4 4v2h16v-2.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" /></svg>
      )
    },
  ],
  [
    {
      title: 'Horizontal Rule', action: (exec) => exec('insertHorizontalRule'), icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 11h20v2H2z" /></svg>
      )
    },
  ],
]

export default function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null)
  const editorWrapRef = useRef(null)
  const isInternalChange = useRef(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedImg, setSelectedImg] = useState(null)
  const [overlay, setOverlay] = useState(null)
  const PLACEHOLDER_ID = 'rte-img-insert-point'

  useEffect(() => {
    if (!editorRef.current) return
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    editorRef.current.innerHTML = value || ''
    setSelectedImg(null)
    setOverlay(null)
  }, [value])

  function computeOverlay(img) {
    if (!img || !editorWrapRef.current) return null
    const imgRect = img.getBoundingClientRect()
    const wrapRect = editorWrapRef.current.getBoundingClientRect()
    return {
      top: imgRect.top - wrapRect.top + editorWrapRef.current.scrollTop,
      left: imgRect.left - wrapRect.left,
      width: imgRect.width,
      height: imgRect.height,
    }
  }

  function selectImg(img) {
    setSelectedImg(img)
    setOverlay(computeOverlay(img))
  }

  function deselectImg() {
    setSelectedImg(null)
    setOverlay(null)
  }

  function notifyChange() {
    isInternalChange.current = true
    onChange(editorRef.current?.innerHTML || '')
  }

  function exec(command, arg = null) {
    editorRef.current?.focus()
    document.execCommand(command, false, arg)
    notifyChange()
  }

  function handleInput() {
    notifyChange()
  }

  function handleEditorClick(e) {
    if (e.target.tagName === 'IMG') {
      selectImg(e.target)
    } else {
      deselectImg()
    }
  }

  function handleEditorKeyDown() {
    deselectImg()
  }

  // Drag-to-resize
  function handleResizeMouseDown(e) {
    e.preventDefault()
    e.stopPropagation()
    const startX = e.clientX
    const startWidth = selectedImg.getBoundingClientRect().width

    function onMouseMove(ev) {
      const newWidth = Math.max(40, Math.round(startWidth + ev.clientX - startX))
      selectedImg.style.width = newWidth + 'px'
      selectedImg.style.maxWidth = '100%'
      selectedImg.style.height = 'auto'
      setOverlay(computeOverlay(selectedImg))
    }

    function onMouseUp() {
      notifyChange()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function handleSetWidth(pct) {
    if (!selectedImg) return
    selectedImg.style.width = pct === 100 ? '100%' : pct + '%'
    selectedImg.style.maxWidth = '100%'
    selectedImg.style.height = 'auto'
    setOverlay(computeOverlay(selectedImg))
    notifyChange()
  }

  function handleDeleteImg() {
    if (!selectedImg) return
    selectedImg.remove()
    deselectImg()
    notifyChange()
  }

  function handleLinkInsert() {
    const url = window.prompt('Masukkan URL:')
    if (!url) return
    editorRef.current?.focus()
    document.execCommand('createLink', false, url)
    notifyChange()
  }

  function openImagePicker() {
    editorRef.current?.focus()
    document.execCommand('insertHTML', false, `<span id="${PLACEHOLDER_ID}"> </span>`)
    isInternalChange.current = true
    setPickerOpen(true)
  }

  function handleInsertImage(url) {
    setPickerOpen(false)
    if (!url) {
      editorRef.current?.querySelector(`#${PLACEHOLDER_ID}`)?.remove()
      notifyChange()
      return
    }
    const img = document.createElement('img')
    img.src = url
    img.alt = 'image'
    img.style.cssText = 'max-width:100%;height:auto;border-radius:4px;margin:8px 0;display:block;'

    const placeholder = editorRef.current?.querySelector(`#${PLACEHOLDER_ID}`)
    if (placeholder) {
      placeholder.replaceWith(img)
    } else {
      editorRef.current?.appendChild(img)
    }
    notifyChange()
  }

  function handleToolbarAction(btn) {
    if (btn.id === 'link') { handleLinkInsert(); return }
    if (btn.id === 'image') { openImagePicker(); return }
    if (btn.action) btn.action(exec)
  }

  return (
    <>
      <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
          {TOOLBAR_GROUPS.map((group, gi) => (
            <div key={gi} className="flex items-center gap-0.5">
              {gi > 0 && <span className="w-px h-5 bg-gray-300 mx-1" />}
              {group.map((btn, bi) => (
                <button
                  key={bi}
                  type="button"
                  title={btn.title}
                  onMouseDown={(e) => { e.preventDefault(); handleToolbarAction(btn) }}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {btn.icon || <span className={btn.className}>{btn.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Editor area */}
        <div ref={editorWrapRef} className="relative">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onClick={handleEditorClick}
            onKeyDown={handleEditorKeyDown}
            className="rich-editor min-h-64 p-4 text-sm focus:outline-none"
          />

          {/* Image resize overlay */}
          {selectedImg && overlay && (
            <div
              className="absolute pointer-events-none"
              style={{ top: overlay.top, left: overlay.left, width: overlay.width, height: overlay.height }}
            >
              {/* Selection border */}
              <div className="absolute inset-0 border-2 border-blue-500 rounded-sm" />

              {/* Toolbar above image */}
              <div className="absolute bottom-full left-0 mb-1 flex items-center gap-1 pointer-events-auto">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSetWidth(pct)}
                    className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-800 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleDeleteImg}
                  className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition-colors ml-1"
                >
                  Hapus
                </button>
              </div>

              {/* Drag resize handle — bottom-right corner */}
              <div
                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-blue-600 cursor-se-resize pointer-events-auto rounded-tl-sm"
                style={{ transform: 'translate(1px, 1px)' }}
                onMouseDown={handleResizeMouseDown}
              />
            </div>
          )}
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => {
          setPickerOpen(false)
          editorRef.current?.querySelector(`#${PLACEHOLDER_ID}`)?.remove()
          notifyChange()
        }}
        onSelect={handleInsertImage}
        multiple={false}
      />
    </>
  )
}
