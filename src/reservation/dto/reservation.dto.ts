import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ReservationDto {
  @IsDate()
  reservationDate: Date;
  @IsNumber()
  reservationDuration: number;
  @IsString()
  @IsNotEmpty()
  reservationTime: string;
  @IsNumber()
  numberOfPeople: number;
  @IsNumber()
  restaurantId: number;
}
