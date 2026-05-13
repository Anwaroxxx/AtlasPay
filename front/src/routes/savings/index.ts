import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SavingsGoalController::index
* @see app/Http/Controllers/SavingsGoalController.php:12
* @route '/savings'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/savings',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SavingsGoalController::index
* @see app/Http/Controllers/SavingsGoalController.php:12
* @route '/savings'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsGoalController::index
* @see app/Http/Controllers/SavingsGoalController.php:12
* @route '/savings'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::index
* @see app/Http/Controllers/SavingsGoalController.php:12
* @route '/savings'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::index
* @see app/Http/Controllers/SavingsGoalController.php:12
* @route '/savings'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::index
* @see app/Http/Controllers/SavingsGoalController.php:12
* @route '/savings'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::index
* @see app/Http/Controllers/SavingsGoalController.php:12
* @route '/savings'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\SavingsGoalController::store
* @see app/Http/Controllers/SavingsGoalController.php:25
* @route '/savings'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/savings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SavingsGoalController::store
* @see app/Http/Controllers/SavingsGoalController.php:25
* @route '/savings'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsGoalController::store
* @see app/Http/Controllers/SavingsGoalController.php:25
* @route '/savings'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::store
* @see app/Http/Controllers/SavingsGoalController.php:25
* @route '/savings'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::store
* @see app/Http/Controllers/SavingsGoalController.php:25
* @route '/savings'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\SavingsGoalController::requestUnlock
* @see app/Http/Controllers/SavingsGoalController.php:80
* @route '/savings/{goal}/request-unlock'
*/
export const requestUnlock = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestUnlock.url(args, options),
    method: 'post',
})

requestUnlock.definition = {
    methods: ["post"],
    url: '/savings/{goal}/request-unlock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SavingsGoalController::requestUnlock
* @see app/Http/Controllers/SavingsGoalController.php:80
* @route '/savings/{goal}/request-unlock'
*/
requestUnlock.url = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { goal: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { goal: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            goal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        goal: typeof args.goal === 'object'
        ? args.goal.id
        : args.goal,
    }

    return requestUnlock.definition.url
            .replace('{goal}', parsedArgs.goal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsGoalController::requestUnlock
* @see app/Http/Controllers/SavingsGoalController.php:80
* @route '/savings/{goal}/request-unlock'
*/
requestUnlock.post = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: requestUnlock.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::requestUnlock
* @see app/Http/Controllers/SavingsGoalController.php:80
* @route '/savings/{goal}/request-unlock'
*/
const requestUnlockForm = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestUnlock.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::requestUnlock
* @see app/Http/Controllers/SavingsGoalController.php:80
* @route '/savings/{goal}/request-unlock'
*/
requestUnlockForm.post = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: requestUnlock.url(args, options),
    method: 'post',
})

requestUnlock.form = requestUnlockForm

/**
* @see \App\Http\Controllers\SavingsGoalController::unlock
* @see app/Http/Controllers/SavingsGoalController.php:107
* @route '/savings/{goal}/unlock'
*/
export const unlock = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlock.url(args, options),
    method: 'post',
})

unlock.definition = {
    methods: ["post"],
    url: '/savings/{goal}/unlock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\SavingsGoalController::unlock
* @see app/Http/Controllers/SavingsGoalController.php:107
* @route '/savings/{goal}/unlock'
*/
unlock.url = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { goal: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { goal: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            goal: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        goal: typeof args.goal === 'object'
        ? args.goal.id
        : args.goal,
    }

    return unlock.definition.url
            .replace('{goal}', parsedArgs.goal.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\SavingsGoalController::unlock
* @see app/Http/Controllers/SavingsGoalController.php:107
* @route '/savings/{goal}/unlock'
*/
unlock.post = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: unlock.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::unlock
* @see app/Http/Controllers/SavingsGoalController.php:107
* @route '/savings/{goal}/unlock'
*/
const unlockForm = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlock.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\SavingsGoalController::unlock
* @see app/Http/Controllers/SavingsGoalController.php:107
* @route '/savings/{goal}/unlock'
*/
unlockForm.post = (args: { goal: string | number | { id: string | number } } | [goal: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: unlock.url(args, options),
    method: 'post',
})

unlock.form = unlockForm

const savings = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    requestUnlock: Object.assign(requestUnlock, requestUnlock),
    unlock: Object.assign(unlock, unlock),
}

export default savings