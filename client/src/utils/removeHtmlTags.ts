export const removeHtmlTags = (text: string) => {
    return text.replace(/<\/?[^>]+(>|$)/g, ""); 
  };