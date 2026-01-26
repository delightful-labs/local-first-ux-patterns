// Disable SSR for the entire app (needed for localStorage to work properly)
export const ssr = false
export const prerender = false
export const trailingSlash = 'always'
// csr defaults to true, which is what we want for client-side rendering
