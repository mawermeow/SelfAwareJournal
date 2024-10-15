import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={onClose}
    >
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
      <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-6 rounded-lg transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
        <Dialog.Title className="text-xl font-semibold mb-4">{title}</Dialog.Title>
        <div>{children}</div>
        <div className="mt-4 text-right">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            關閉
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
