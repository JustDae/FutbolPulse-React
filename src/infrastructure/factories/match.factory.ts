export class MatchFactory {
  static createDefault(): any {
    return {
      id: '',
      homeTeam: '',
      awayTeam: '',
      date: new Date(),
      status: 'SCHEDULED',
      score: null
    };
  }
}
