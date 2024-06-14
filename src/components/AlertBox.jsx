import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AlertBox = ({
  header = false,
  open = false,
  onOpenChange = false,
  title = "",
  description = "",
  footer = false,
  footerAlertAction = [],
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        {header && (
          <AlertDialogHeader>
            {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
            {description && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
        )}
        {footer && (
          <AlertDialogFooter>
            {footerAlertAction &&
              footerAlertAction.map(({ onClick, label }) => {
                return (
                  <AlertDialogAction onClick={onClick} key={label}>
                    {label}
                  </AlertDialogAction>
                );
              })}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertBox;
