/*
 * 
 */
package in.airiyan.asl;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 *
 * @author E.SATHESKUMAR
 */
public class CorsFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
         HttpServletResponse httpResponse = (HttpServletResponse) response;
            // Allow requests from all origins (for development/testing, be more specific in production)
            httpResponse.setHeader("Access-Control-Allow-Origin", "*"); 
            // Allow specific HTTP methods
//            httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpResponse.setHeader("Access-Control-Allow-Methods", "GET");
            // Allow specific headers in the request
            httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            // Allow credentials (e.g., cookies) to be sent with cross-origin requests
            // If true, Access-Control-Allow-Origin cannot be '*'
            // httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            // Max age for preflight requests (in seconds)
            httpResponse.setHeader("Access-Control-Max-Age", "7200");

            // Continue the filter chain
            chain.doFilter(request, httpResponse);
    }
    
}
