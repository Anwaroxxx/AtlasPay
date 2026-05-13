import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BudgetController::store
* @see app/Http/Controllers/BudgetController.php:11
* @route '/budgets'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/budgets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BudgetController::store
* @see app/Http/Controllers/BudgetController.php:11
* @route '/budgets'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BudgetController::store
* @see app/Http/Controllers/BudgetController.php:11
* @route '/budgets'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BudgetController::store
* @see app/Http/Controllers/BudgetController.php:11
* @route '/budgets'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BudgetController::store
* @see app/Http/Controllers/BudgetController.php:11
* @route '/budgets'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const BudgetController = { store }

export default BudgetController