import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (imageUrl: string | null) => void;
  selectedImage: string | null;
}

export function ImageUpload({ onImageSelect, selectedImage }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일을 Data URL로 변환
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onImageSelect(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      {selectedImage ? (
        <div className="relative inline-block">
          <img
            src={selectedImage}
            alt="선택된 이미지"
            className="w-16 h-16 object-cover rounded-lg border"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => inputRef.current?.click()}
          className="text-gray-500"
        >
          <ImagePlus size={20} />
        </Button>
      )}
    </div>
  );
}
