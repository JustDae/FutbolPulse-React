export class PlayerFactory {
  static createDefault(): any {
    return {
      id: '',
      name: '',
      number: 0,
      position: 'MID',
      teamId: null
    };
  }
}
