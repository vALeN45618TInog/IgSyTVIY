// 代码生成时间: 2025-10-20 06:07:16
import { ApolloEngine } from 'apollo-server';
import dns from 'dns';

// Type definitions
interface CacheEntry {
  address: string;
  timestamp: number;
}

class DnsCacheTool {
  // Cache storage
  private cache: Map<string, CacheEntry>;
  // Cache expiration time in milliseconds
  private cacheExpiration: number;

  // Constructor
  constructor(cacheExpiration: number = 3600000) { // default 1 hour
    this.cache = new Map<string, CacheEntry>();
    this.cacheExpiration = cacheExpiration;
  }

  /**
   * Resolves a domain to an IP address using DNS.
   * @param domain The domain to resolve.
   * @returns The IP address of the domain.
   */
  public async resolve(domain: string): Promise<string> {
    try {
      // Check cache first
      const cachedEntry = this.cache.get(domain);
      if (cachedEntry && (Date.now() - cachedEntry.timestamp) < this.cacheExpiration) {
        // Return cached result if within expiration time
        return cachedEntry.address;
      }

      // Perform DNS resolution
      const address = await new Promise<string>((resolve, reject) => {
        dns.lookup(domain, (err, address, family) => {
          if (err) {
            reject(err);
          } else {
            resolve(address);
          }
        });
      });

      // Cache the result
      this.cache.set(domain, { address, timestamp: Date.now() });

      return address;
    } catch (error) {
      // Handle any errors that occur during DNS resolution
      console.error(`Error resolving ${domain}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Clears the cache for a specific domain.
   * @param domain The domain to clear from cache.
   */
  public clearCache(domain: string): void {
    this.cache.delete(domain);
  }
}

// Example usage
const dnsTool = new DnsCacheTool();

dnsTool.resolve('example.com')
  .then(ip => console.log(`Resolved IP: ${ip}`))
  .catch(err => console.error(`Error resolving IP: ${err.message}`));
