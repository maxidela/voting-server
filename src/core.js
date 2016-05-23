import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
    return state.set('entries', List(entries));
}

export function next(state) {
    const entries = state.get('entries')
        .concat(getWinners(state.get('vote')));

    if (entries.size === 1) {
        return state.remove('vote')
            .remove('entries')
            .set('winner', entries.first());
    } else {
        return state.merge({
            vote: Map({pair: entries.take(2)}),
            entries: entries.skip(2)
        });
    }
}

export function vote(voteState, entry) {
    if (voteState.get('pair').includes(entry)) {
        return voteState.updateIn(
            ['tally', entry],
            0,
            tally => tally + 1
        );
    }
    return voteState;
}

function getWinners(vote) {
    if (!vote) return [];
    const pair = vote.get('pair');
    const oneVotes = vote.getIn(['tally', pair.get(0)], 0);
    const twoVotes = vote.getIn(['tally', pair.get(1)], 0);
    if      (oneVotes > twoVotes)  return pair.get(0);
    else if (oneVotes < twoVotes)  return pair.get(1);
    else                           return pair;
}