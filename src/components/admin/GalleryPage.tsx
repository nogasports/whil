@@ .. @@
   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
+    
+    // Check file size before processing
+    if (file.size > 1024 * 1024) {
+      alert('File size must be less than 1MB');
+      return;
+    }
 
     try {
       setUploading(true);
@@ -33,7 +39,7 @@
       });
 
     } catch (error) {
-      console.error('Error uploading image:', error);
+      alert(error instanceof Error ? error.message : 'Failed to upload image');
     } finally {
       setUploading(false);
     }
@@ .. @@