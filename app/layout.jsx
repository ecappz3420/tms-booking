import { Inter } from 'next/font/google'
import '../styles/global.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500'],
  display: 'swap'
})

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}