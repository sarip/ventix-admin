/**
 * @author : Herlangga Sefani <https://github.com/gaibz>
 */

'use strict';

/**
 * Interface for filter parameter object
 */
interface FilterParam {
    min_equals?: number | string;
    max_equals?: number | string;
    min?: number | string;
    max?: number | string;
    between?: [number | string, number | string];
    in_array?: Array<number | string>;
    contains?: Array<string>;
}

/**
 * Interface for query object
 */
interface Query {
    [key: string]: string | number | FilterParam | Array<number | string>;
}

/**
 * Build query for filter parameter
 * usage :
 * <code>
 * let filter = {
 *     field : value, // equals
 *     field : {
 *         min_equals : value,
 *         max_equals : value,
 *         min : value,
 *         max : value,
 *         between : [value_min, value_max],
 *         in_array : [value1, value2, value3]
 *     },
 * }
 * filter = FilterDriver.buildQuery(filter);
 * </code>
 * @param query {Query}
 * @return {string}
 */
function buildQuery(query: Query = {}): string {
    let filter: string[] = [];

    for (let q in query) {
        if (query.hasOwnProperty(q)) {
            const qparam = query[q];

            if (typeof qparam === 'object' && !Array.isArray(qparam)) {
                if ('min_equals' in qparam) {
                    filter.push(`${q}:>=${qparam.min_equals}`);
                }
                if ('max_equals' in qparam) {
                    filter.push(`${q}:<=${qparam.max_equals}`);
                }
                if ('min' in qparam) {
                    filter.push(`${q}:>${qparam.min}`);
                }
                if ('max' in qparam) {
                    filter.push(`${q}:<${qparam.max}`);
                }
                if ('between' in qparam) {
                    const [min, max] = qparam.between;
                    if (min !== undefined && max !== undefined) {
                        filter.push(`${q}:${min}-${max}`);
                    } else if (min !== undefined) {
                        filter.push(`${q}:>=${min}`);
                    } else if (max !== undefined) {
                        filter.push(`${q}:<=${max}`);
                    }
                }
                if ('in_array' in qparam) {
                    filter.push(`${q}:${qparam.in_array.join(',')}`);
                }
                if ('contains' in qparam) {
                    filter.push(`${q}:@${qparam.contains.join('|')}`);
                }
            } else {
                filter.push(`${q}:${qparam}`);
            }
        }
    }

    return filter.join(";");
}

export { buildQuery };
