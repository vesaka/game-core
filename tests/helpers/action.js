import Action from '$core/utils/patterns/action';
import { expect, vi } from 'vitest';

export const spyEvents = (...events) => {
    events.forEach((event) => {
        expect(Action.run).toHaveBeenCalledWith(event);
    });
};

export const spyEvent = (event) => {
    expect(Action.run).toHaveBeenCalledWith(event);
};