<script>
   export let downloadId;
   const url = `https://routinehub.co/download/${downloadId}/`;
</script>


<div class="fake"></div>
<div class="navbar">
   <a id="logo" href="/">
      <img src="/assets/logo.png" alt=""> <span><h3>AirForce</h3></span>
   </a>
   <div id="options">
      <a href={url}>Download</a>
   </div>
</div>

<style>
   img{
      height: 40px;
      margin-right: 7px;
   }
</style>