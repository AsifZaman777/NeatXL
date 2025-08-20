import { GoogleAnalytics } from '@next/third-parties/google'
import { GoogleTagManager } from '@next/third-parties/google'

export default function Analytics() {
  return (
    <>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      <GoogleTagManager gtmId="GTM-XXXXXXX" />
    </>
  )
}
