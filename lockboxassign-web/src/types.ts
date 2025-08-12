export type AssignedEquipmentDto = {
  id: string;
  unitNumber: string;
  status: string;
  parkingSpot?: string | null;
} | null;
export interface LockboxRowDto {
  id: string;
  label: string;
  assignedEquipment: AssignedEquipmentDto;
}
export interface EquipmentListItemDto {
  id: string;
  unitNumber: string;
  status: string;
  parkingSpot?: string | null;
}
