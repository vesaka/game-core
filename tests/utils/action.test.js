import Action from '$core/utils/patterns/action';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Action', () => {
    beforeEach(() => {
        Action.clear();
    });
    it('registers event', () => {
        Action.add('test', () => { console.log('hello') });
        expect(Action).toHaveProperty('test');
        expect(Action.test).toBeInstanceOf(Array);
        expect(Action.test).toHaveLength(1);
        expect(Action.test[0]).toBeInstanceOf(Function);
    });

    it('calls event', () => {
        const spy = vi.fn();
        Action.add('test', spy);
        Action.run('test');
        expect(spy).toHaveBeenCalled();
    });

    it('calls event with arguments', () => {
        const spy = vi.fn();
        Action.add('test', spy);
        Action.run('test', 'hello', 'world');
        expect(spy).toHaveBeenCalledWith('hello', 'world');
    });

    it('removes event', () => {
        const spy = vi.fn();
        Action.add('test', spy);
        Action.remove('test');
        Action.run('test');
        expect(Action.test).toHaveLength(0);
        expect(spy).not.toHaveBeenCalled();
    });

    it('removes event with priority', () => {
        const spy = vi.fn();
        const spy2 = vi.fn();
        Action.add('test', spy);
        Action.add('test', spy2, 1);
        Action.remove('test', 1);
        Action.run('test');
        expect(Action.test[1]).not.toBeInstanceOf(Function);
        expect(spy).toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });

    it('clears all events', () => {
        const spy = vi.fn();
        const spy2 = vi.fn();
        Action.add('test', spy);
        Action.add('test', spy2, 1);
        Action.clear();
        Action.run('test');
        expect(Action.test).toHaveLength(0);
        expect(spy).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();
    });

    it('sets new priority if already exists', () => {
        const spy = vi.fn();
        Action.add('test', spy, 4);
        expect(Action.getPriority('test', 4)).toBe(5);
    });
});
