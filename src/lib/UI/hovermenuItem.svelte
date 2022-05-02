<li><slot /></li>

<style>
  li {
    position: relative;
    display: block;
    transition-duration: 0.5s;
    inline-size: 100%;
  }

  li:hover,
  li:focus {
    background-color: gray;
    cursor: pointer;
  }
</style>