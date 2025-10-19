// export const BACKEND_API_URL = "https://khelwell.com/khelwell_backend/api/";
export const BACKEND_API_URL = "http://localhost/creatimatix/inhouse/creatimatixApp/backend/api/";
export const TurfDefaultImg = "https://turftown.in/_next/image?url=https%3A%2F%2Fturftown.s3.ap-south-1.amazonaws.com%2Fsuper_admin%2Ftt-1726811620216.webp&w=828&q=75";


export const formatPrice = (price: number | null): string => {
    if (!price) return 'Price on request';
    return `₹${price}/hour`;
  };
  