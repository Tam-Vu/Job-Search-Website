import { X, FileIcon, ImageIcon, FileTextIcon, FileSpreadsheetIcon } from "lucide-react"

interface FilePreviewProps {
  file: File;
  preview: string | null;
  onRemove: () => void;
}

export const FilePreview = ({ file, preview, onRemove }: FilePreviewProps) => {
  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />;
    if (file.type.includes("spreadsheet") || file.type.includes("excel")) 
      return <FileSpreadsheetIcon className="h-5 w-5" />;
    if (file.type.includes("text") || file.type.includes("pdf") || file.type.includes("doc")) 
      return <FileTextIcon className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="relative rounded-md border bg-gray-50 p-2">
      <button
        onClick={onRemove}
        className="absolute -right-1 -top-1 rounded-full bg-gray-100 p-1 shadow-sm hover:bg-gray-200"
      >
        <X className="h-3 w-3" />
      </button>
      
      {preview ? (
        <div className="relative h-16 w-16">
          <img src={preview} alt={file.name} className="h-full w-full rounded object-cover" />
        </div>
      ) : (
        <div className="flex items-center space-x-2 p-2">
          {getFileIcon()}
          <div>
            <div className="max-w-[120px] truncate text-xs font-medium">{file.name}</div>
            <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
          </div>
        </div>
      )}
    </div>
  );
};
