export class TournamentFactory {
  static createDefault(): any {
    return {
      id: '',
      name: '',
      format: 'LEAGUE',
      startDate: new Date(),
      endDate: new Date(),
      status: 'DRAFT'
    };
  }
}
