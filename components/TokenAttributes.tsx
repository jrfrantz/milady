import Link from 'next/link'
import formatUrl from 'lib/formatUrl'
import { paths } from '@reservoir0x/client-sdk'

type Props = {
  token: NonNullable<
    paths['/tokens/details/v2']['get']['responses']['200']['schema']['tokens']
  >[0]['token']
}

const TokenAttributes = ({ token }: Props) => {
  return (
    <article className="col-span-full rounded-none border-2 border-gray-500 bg-white p-6">
      <p className="reservoir-h5 mb-4">Attributes</p>
      <div className="grid grid-cols-3 gap-2">
        {token?.attributes?.map(({ key, value }) => (
          <Link
            key={`${key}-${value}`}
            href={`/collections/${token?.collection?.id}?${formatUrl(
              `attributes[${key}]`
            )}=${formatUrl(`${value}`)}`}
          >
            <a className="rounded-none border-2 border-gray-300 transition  hover:shadow-md">
              <p className="reservoir-subtitle truncate p-3 text-center capitalize">
                {key}
              </p>
              <p
                className="reservoir-subtitle truncate bg-primary-100 p-3 text-center capitalize"
                title={value}
              >
                {value}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </article>
  )
}

export default TokenAttributes
