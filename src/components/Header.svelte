<script>
   export let downloadId;
   const url = `https://routinehub.co/download/${downloadId}/`;
</script>


<div class="fake"></div>
<div class="navbar">
   <a id="logo" href="/">
      <img src="/assets/logo.png" alt=""> <span>AirForce</span>
   </a>
   <div id="options">
      <a href={url}>Download</a>
   </div>
</div>

<style>
   img{
      height: 40px;
      margin-right: 5px;
   }
</style>