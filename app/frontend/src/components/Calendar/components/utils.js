import format from 'date-fns/format';
export const ISO_FORMAT = 'yyyy-MM-dd';


export const formatDate = (date) => {
  return format(date, ISO_FORMAT);
};
