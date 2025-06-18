import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

export default function TestUI() {
  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-nylag">NYLAG UI Design System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Testing all UI components for consistency and accessibility.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Icon Buttons</h4>
            <div className="flex gap-2 flex-wrap">
              <IconButton icon="send" tooltip="Send message">
                Send
              </IconButton>
              <IconButton icon="loading" disabled>
                Loading
              </IconButton>
              <IconButton icon="help" variant="outline" tooltip="Get help with legal research">
                Help
              </IconButton>
              <IconButton icon="send" size="icon" tooltip="Quick send" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Elements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Test input field" />
          <Input placeholder="Disabled input" disabled />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors & Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-nylag-primary-blue rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">NYLAG Blue</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Secondary</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Destructive</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-serif text-lg">Serif font (IBM Plex Serif)</p>
            <p className="font-sans">Sans-serif font (System)</p>
            <p className="text-nylag-primary-blue font-medium">NYLAG blue text</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
