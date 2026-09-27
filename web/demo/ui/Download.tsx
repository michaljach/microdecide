import { useEffect, useRef, useState } from "react";

export interface DownloadFile { blob: Blob; name: string }

/** React owns the anchor and URL lifetime; the ref invokes the browser download action. */
export function Download({ file }: { file: DownloadFile | null }) {
  const anchor = useRef<HTMLAnchorElement>(null);
  const [resource, setResource] = useState<{ file: DownloadFile; url: string } | null>(null);
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file.blob);
    setResource({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);
  useEffect(() => {
    if (resource?.file === file) anchor.current?.click();
  }, [resource, file]);
  return resource?.file === file && resource ? <a ref={anchor} href={resource.url} download={file!.name} hidden /> : null;
}
