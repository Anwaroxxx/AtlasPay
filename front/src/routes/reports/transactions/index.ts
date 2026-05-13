import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ReportController::pdf
* @see app/Http/Controllers/ReportController.php:121
* @route '/reports/transactions/pdf'
*/
export const pdf = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})

pdf.definition = {
    methods: ["get","head"],
    url: '/reports/transactions/pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReportController::pdf
* @see app/Http/Controllers/ReportController.php:121
* @route '/reports/transactions/pdf'
*/
pdf.url = (options?: RouteQueryOptions) => {
    return pdf.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReportController::pdf
* @see app/Http/Controllers/ReportController.php:121
* @route '/reports/transactions/pdf'
*/
pdf.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pdf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::pdf
* @see app/Http/Controllers/ReportController.php:121
* @route '/reports/transactions/pdf'
*/
pdf.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pdf.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ReportController::pdf
* @see app/Http/Controllers/ReportController.php:121
* @route '/reports/transactions/pdf'
*/
const pdfForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::pdf
* @see app/Http/Controllers/ReportController.php:121
* @route '/reports/transactions/pdf'
*/
pdfForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReportController::pdf
* @see app/Http/Controllers/ReportController.php:121
* @route '/reports/transactions/pdf'
*/
pdfForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pdf.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pdf.form = pdfForm

const transactions = {
    pdf: Object.assign(pdf, pdf),
}

export default transactions