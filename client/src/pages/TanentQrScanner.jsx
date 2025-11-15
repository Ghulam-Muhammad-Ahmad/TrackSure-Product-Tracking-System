import { QrScanConfigPreview } from '@/components/QrScanConfigPreview'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { API } from '@/config/api'

function TanentQrScanner() {
  const { tenantId } = useParams()
  const [searchParams] = useSearchParams()
  const [scanData, setScanData] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      fetch(`${API.QR_SCAN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ qr_token: token, tenantId }),
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setScanData({
            productName: data.data.product.product_name,
            productImage: data.data.product.image_url,
            manufacturer: data.data.qr_details_normalized.Manufacturer,
            owner: data.data.qr_details_normalized.CurrentOwner,
            brandName: data.data.tenant.brandName,
            logoUrl: data.data.tenant.logoUrl,
            redirectUrl: '',
            description: data.data.tenant.description,
            themeColor: data.data.tenant.themeColor,
            productStatus: data.data.qr_details_normalized.ProductStatus,
            productCategory: data.data.qr_details_normalized.Category
          })
        } else {
          console.error('Error scanning QR code:', data.message)
        }
      })
      .catch(error => console.error('Error scanning QR code:', error))
    }
  }, [tenantId, searchParams])

  return (
    <div className='w-full min-h-screen flex justify-center items-center'>
      {scanData ? (
        <QrScanConfigPreview 
        productName={scanData.productName}
          brandName={scanData.brandName}
          logoUrl={scanData.logoUrl}
          redirectUrl={scanData.redirectUrl}
          description={scanData.description}
          themeColor={scanData.themeColor}
          productImage={scanData.productImage}
          manufacturer={scanData.manufacturer}
          owner={scanData.owner}
          productCategory={scanData.productCategory}
          productStatus={scanData.productStatus}
        />
      ) : (
        <p>Scanning...</p>
      )}
    </div>
  )
}

export default TanentQrScanner