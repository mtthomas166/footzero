export function getFavoriteTeams() {
  if (typeof window === 'undefined') return [];
  try {
    const favs = localStorage.getItem('fav_teams');
    return favs ? JSON.parse(favs) : [];
  } catch (e) {
    return [];
  }
}

export function isTeamFavorited(teamName) {
  if (!teamName) return false;
  const favs = getFavoriteTeams();
  return favs.some(name => name.toLowerCase() === teamName.toLowerCase());
}

export function toggleFavoriteTeam(teamName) {
  if (typeof window === 'undefined' || !teamName) return false;
  try {
    const favs = getFavoriteTeams();
    const index = favs.findIndex(name => name.toLowerCase() === teamName.toLowerCase());
    let newFavs = [...favs];
    
    if (index >= 0) {
      newFavs.splice(index, 1);
    } else {
      newFavs.push(teamName);
    }
    
    localStorage.setItem('fav_teams', JSON.stringify(newFavs));
    
    // Dispatch custom event to notify other active list cards
    window.dispatchEvent(new Event('favorites-updated'));
    return index < 0; // Returns true if added, false if removed
  } catch (e) {
    return false;
  }
}
