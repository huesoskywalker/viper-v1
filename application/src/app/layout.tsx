import './globals.css'
import type { ReactNode } from 'react'
import AuthProvider from './_providers/AuthProvider'
import { GlobalNav } from './_components/GlobalNav'
import { Metadata } from 'next'

export const metadata: Metadata = {
   title: 'Viper',
   description: 'The best application to find events and schedule your week with fun',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
   return (
      <html>
         <body className="overflow-y-scroll bg-gray-900 ">
            <AuthProvider>
               <GlobalNav />
               <div className="lg:pl-44">
                  <div className="mx-auto max-w-4xl space-y-8 px-2 pt-20 lg:px-8 lg:py-8">
                     <div className="bg-vc-border-gradient rounded-lg p-px shadow-lg shadow-black/20">
                        <div className="rounded-lg bg-black p-3.5 lg:p-6">{children}</div>
                     </div>
                  </div>
               </div>
            </AuthProvider>
         </body>
      </html>
   )
}
