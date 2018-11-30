import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class JDBCDemo {

    public static void main(String[] args){
        Connection conn;
        Statement stmt;
        try{
            // Load JDBC driver
            Class.forName("org.postgresql.Driver");

            // establish connection
            String url = "jdbc:postgresql://localhost:5432/disastermngt";
            conn = DriverManager.getConnection(url, "postgres", "admin");

            // query the database
            String sql = "SELECT id, report_type, disaster_type, time_stamp, ST_AsText(geom) as geom FROM Report";
            stmt = conn.createStatement();
            ResultSet res = stmt.executeQuery(sql);

            if (res!=null){
                while (res.next()){
                    System.out.println("id: " + res.getString("id"));
                    System.out.println("report_type: " + res.getString("report_type"));
                    System.out.println("disaster: " + res.getString("disaster_type"));
                    System.out.println("time_stamp: " + res.getString("time_stamp"));
                    System.out.println("geom: " + res.getString("geom"));
                }
            }

            stmt.close();
            conn.close();
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }
}
