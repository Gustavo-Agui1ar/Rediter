const segundosEmMinuto = 60;
const segundosEmHora = 3600;
const segundosEmDia = 86400;

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < segundosEmMinuto) {
    return `${diffInSeconds} segundos atrás`;
  } else if (diffInSeconds < segundosEmHora) {
    return `${Math.floor(diffInSeconds / segundosEmMinuto)} minutos atrás`;
  } else if (diffInSeconds < segundosEmDia) {
    return `${Math.floor(diffInSeconds / segundosEmHora)} horas atrás`;
  } else if (diffInSeconds < segundosEmDia * 7) {
    return `${Math.floor(diffInSeconds / segundosEmDia)} dias atrás`;
  } else {
    return date.toLocaleDateString();
  }
};
