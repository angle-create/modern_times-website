export function StoreInfo() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brown-900">基本情報</h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">店舗名</dt>
            <dd className="mt-1 text-gray-900">Modern Times</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">住所</dt>
            <dd className="mt-1 text-gray-900">
              〒150-0001
              <br />
              東京都渋谷区神宮前X-X-X
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">電話番号</dt>
            <dd className="mt-1 text-gray-900">03-XXXX-XXXX</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brown-900">営業時間</h2>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">平日・土曜</dt>
            <dd className="mt-1 text-gray-900">10:00 - 20:00</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">日曜・祝日</dt>
            <dd className="mt-1 text-gray-900">11:00 - 19:00</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">定休日</dt>
            <dd className="mt-1 text-gray-900">毎週水曜日</dd>
          </div>
        </dl>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brown-900">駐車場</h2>
        <p className="text-gray-600">
          専用駐車場：2台
          <br />
          ※お買い物をされたお客様は1時間無料
        </p>
      </section>
    </div>
  )
} 