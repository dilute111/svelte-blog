<script lang="ts">
    import {resolve} from "$app/paths";

    let { children } = $props()
</script>

<div>
    <h1>About us</h1>
        <ul>
            <li><a href={resolve("/about/contacts")}>Contacts</a></li>
            <li><a href={resolve("/about/team")}>Team</a></li>
        </ul>
    {@render children()}
</div>