/**
 * API Layer for Photo Sharing Application
 * Fetches REST API endpoints using fetch
 */

let usersCache = {};

/**
 * Main fetch function that calls REST API backend
 * @param {string} url - The endpoint path (e.g., "/user/list", "/user/1", "/photosOfUser/1")
 * @returns {Promise} - Resolves with data or rejects with error
 */
export async function fetchModel(url) {
  try {
    const response = await fetch(`http://localhost:8081/api${url}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const data = await response.json();

    if (url === "/user/list") {
      const result = data.map(u => ({ id: u._id, firstName: u.first_name, lastName: u.last_name }));
      result.forEach(u => usersCache[u.id] = u);
      return result;
    }

    if (url.startsWith("/user/")) {
      const u = data;
      const result = {
        id: u._id,
        firstName: u.first_name,
        lastName: u.last_name,
        location: u.location,
        description: u.description,
        occupation: u.occupation
      };
      usersCache[result.id] = result;
      return result;
    }

    if (url.startsWith("/photosOfUser/")) {
      return data.map(p => ({
        id: p._id,
        userId: p.user_id,
        createdDate: p.date_time,
        imageUrl: `/images/${p.file_name}`,
        file_name: p.file_name,
        comments: (p.comments || []).map(c => {
          if (c.user) {
            usersCache[c.user._id] = { id: c.user._id, firstName: c.user.first_name, lastName: c.user.last_name };
          }
          return {
            _id: c._id,
            author: c.user ? c.user._id : null,
            text: c.comment,
            createdDate: c.date_time
          };
        })
      }));
    }

    throw new Error(`Unknown endpoint: ${url}`);
  } catch (error) {
    throw error;
  }
}

/**
 * Helper function to find user by ID from cache
 * @param {string} userId - User ID to find
 * @returns {object|null} - User object or null if not found
 */
export function getUserById(userId) {
  return usersCache[userId] || null;
}

// eslint-disable-next-line import/no-anonymous-default-export
const exportedModule = { fetchModel, getUserById };
export default exportedModule;
