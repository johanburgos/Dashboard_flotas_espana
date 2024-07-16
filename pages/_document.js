import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script src="https://api.map.baidu.com/api?v=3.0&ak=YOUR_API_KEY" />
        <Script src="https://fastly.jsdelivr.net/npm/echarts@5.4.3/dist/extension/bmap.min.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
