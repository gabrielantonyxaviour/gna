import Image from "next/image";

interface LayoutComponentProps {
  children: React.ReactNode;
}

export default function LayoutComponent({ children }: LayoutComponentProps) {
  return (
    <>
      <div className="h-screen flex">{children}</div>
    </>
  );
}
