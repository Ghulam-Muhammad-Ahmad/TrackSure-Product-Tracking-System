// DeleteAlert.jsx
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function DeleteAlert({ open, onClose, onConfirm, error, success }) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this item?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="cursor-pointer">
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
    </AlertDialog>
  );
}
