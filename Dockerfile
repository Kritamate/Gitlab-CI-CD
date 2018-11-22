FROM node:10-alpine
ENV NODE_ENV=production
WORKDIR /app
# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000

# Install deps for production only
COPY ./package* ./
RUN npm install && \
  npm cache clean --force
# Copy builded source from the upper builder stage
COPY /src ./src

# Start the app
CMD ["node", "src/index.js"]
