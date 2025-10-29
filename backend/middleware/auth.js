import { clerkClient } from "@clerk/clerk-sdk-node";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.replace("Bearer ", "");

    const session = await clerkClient.sessions.verifySession(token);

    if (!session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = session.userId;

    next();
  } catch (err) {
    console.error("Auth failed:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await clerkClient.users.getUser(req.userId);

      const userRole = user.privateMetadata.role;

      if (userRole !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      console.error("Role check failed:", err);
      return res.status(403).json({ message: "Forbidden" });
    }
  };
};
