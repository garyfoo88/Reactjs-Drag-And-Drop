import dynamic from 'next/dynamic'

//React rnd throws an error whenever there is mismatch between SSR and CSR, to prevent that, convert RND page to stricly CSR
const DynamicComponentWithNoSSR = dynamic(
  () => import('../components/Rnd'),
  { ssr: false }
)

export default function Home() {
  return (
    <div>
      <DynamicComponentWithNoSSR />
    </div>
  );
}

// export async function getStaticProps(context) {
//   resetServerContext()
//   console.log('ahah')
//   return {
//     props: {}, // will be passed to the page component as props
//   }
// }