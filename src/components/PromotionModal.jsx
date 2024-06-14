import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PromotionModal = ({ show, onSelect, onClose }) => {
  const pieces = [
    {
      label: "Queen",
      name: "q",
    },
    {
      label: "Rook",
      name: "r",
    },
    {
      label: "Bishop",
      name: "b",
    },
    {
      label: "Knight",
      name: "n",
    },
  ];

  return (
    <>
      <AlertDialog open={show}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Serlect Promotion Piece</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {pieces.map((piece) => (
              <AlertDialogAction
                key={piece.name}
                onClick={() => onSelect(piece.name)}
              >
                {piece.label}
              </AlertDialogAction>
            ))}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PromotionModal;
