import type { CreatePlayerDto } from './create-player.dto';

export interface UpdatePlayerDto extends Partial<CreatePlayerDto> {}