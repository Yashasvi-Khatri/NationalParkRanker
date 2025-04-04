// Type definitions for the park images JSON file

declare module "*.json" {
  const parkImages: {
    [key: string]: string;
  };
  export default parkImages;
}