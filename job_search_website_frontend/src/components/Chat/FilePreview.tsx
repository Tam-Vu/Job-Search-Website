import { X } from "lucide-react"
import { FileIcon, FileImageIcon, FileTextIcon } from "lucide-react"

interface FilePreviewProps {
  file: File
  preview: string | null
  onRemove: () => void
}

export const FilePreview = ({ file, preview, onRemove }: FilePreviewProps) => {
  const getFileIcon = () => {
    if (file.type.startsWith("image/")) {
      return <FileImageIcon size={24} className="text-blue-500" />
    } else if (file.type.startsWith("text/")) {
      return <FileTextIcon size={24} className="text-yellow-500" />
    } else {
      return <FileIcon size={24} className="text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="relative flex w-fit items-center rounded-md border p-2">
      <button onClick={onRemove} className="absolute -right-2 -top-2 rounded-full bg-gray-500 p-0.5 text-white">
        <X size={14} />
      </button>

      {preview ? (
        <img src={preview} alt={file.name} className="h-12 w-12 rounded-md object-cover" />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">{getFileIcon()}</div>
      )}

      <div className="ml-2 max-w-[120px]">
        <div className="truncate text-xs font-medium">{file.name}</div>
        <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
      </div>
    </div>
  )
}
