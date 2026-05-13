import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import transactionsBbd80d from './transactions'
/**
* @see \App\Http\Controllers\ReportController::transactions
* @see app/Http/Controllers/ReportController.php:17
* @route '/reports/transactions'
*/
export const transactions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

transactions.definition = {
    methods: ["get","head"],
    url: '/reports/transactions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::transactions
* @see app/Http/Controllers/ReportController.php:17
* @route '/reports/transactions'
*/
transactions.url = (options?: RouteQueryOptions) => {
    return transactions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::transactions
* @see app/Http/Controllers/ReportController.php:17
* @route '/reports/transactions'
*/
transactions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transactions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::transactions
* @see app/Http/Controllers/ReportController.php:17
* @route '/reports/transactions'
*/
transactions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transactions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::transactions
* @see app/Http/Controllers/ReportController.php:17
* @route '/reports/transactions'
*/
const transactionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transactions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::transactions
* @see app/Http/Controllers/ReportController.php:17
* @route '/reports/transactions'
*/
transactionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transactions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::transactions
* @see app/Http/Controllers/ReportController.php:17
* @route '/reports/transactions'
*/
transactionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: transactions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

transactions.form = transactionsForm

const reports = {
    transactions: Object.assign(transactions, transactionsBbd80d),
}

export default reports