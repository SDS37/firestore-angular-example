import { JoinPipe } from './join.pipe';

describe('JoinPipe', () => {
  const pipe = new JoinPipe();

  it('should join array values with comma separator', () => {
    expect(pipe.transform(['eggs', 'bacon'])).toBe('eggs, bacon');
  });

  it('should return non-array values unchanged', () => {
    expect(pipe.transform('plain')).toBe('plain');
  });
});
